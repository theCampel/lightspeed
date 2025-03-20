import os
import asyncio
import logging

import assemblyai as aai
from dotenv import load_dotenv
from app.services.context_manager import ContextManager

load_dotenv()

aai.settings.api_key = os.getenv('ASSEMBLYAI_API_KEY')

TWILIO_SAMPLE_RATE = 8000 # Hz

verbose = False

# Configure logging
logger = logging.getLogger(__name__)

# Global context manager instance
context_manager = ContextManager()


def on_open(session_opened: aai.RealtimeSessionOpened):
    "Called when the connection has been established."
    logger.info(f"Session ID: {session_opened.session_id}")


def on_data(transcript: aai.RealtimeTranscript):
    "Called when a new transcript has been received."
    if not transcript.text:
        return

    if isinstance(transcript, aai.RealtimeFinalTranscript):
        logger.info(f"FINAL TRANSCRIPT: {transcript.text}")
        # Process the final transcript using the context manager
        process_final_transcript(transcript.text)
    elif verbose:    
        logger.info(f"INTERIM TRANSCRIPT: {transcript.text}")


def process_final_transcript(text: str):
    """
    Process a final transcript using the context manager.
    This is a synchronous wrapper around the async process_text method.
    """
    # Skip processing for short transcripts (less than 3 words)
    word_count = len(text.split())
    if word_count < 3:
        logger.info(f"Skipping processing for short transcript ({word_count} words): '{text}'")
        return {"status": "skipped", "reason": "transcript too short"}
        
    try:
        # Create a new event loop for this call
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        # Run the async function in the loop
        result = loop.run_until_complete(context_manager.process_text(text))
        logger.info(f"Processing result: {result}")
        
        # Clean up
        loop.close()
        
        return result
    except Exception as e:
        logger.error(f"Error processing transcript: {e}")
        return {"error": str(e)}


def on_error(error: aai.RealtimeError):
    "Called when the connection has been closed."
    logger.error(f"An error occurred: {error}")


def on_close():
    "Called when the connection has been closed."
    logger.info("Closing Session")


class TwilioTranscriber(aai.RealtimeTranscriber):
    def __init__(self):
        super().__init__(
            on_data=on_data,
            on_error=on_error,
            on_open=on_open, # optional
            on_close=on_close, # optional
            sample_rate=TWILIO_SAMPLE_RATE,
            encoding=aai.AudioEncoding.pcm_mulaw
        )