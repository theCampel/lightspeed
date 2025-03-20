import os
import asyncio
import logging

import assemblyai as aai
from dotenv import load_dotenv
from app.services.context_manager import ContextManager
from app.websocket_manager import send_card

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

        result = process_final_transcript(transcript.text) 
        # Create a card with the transcript and result
        card_data = {
            "type": "transcript",
            "content": transcript.text,
            "result": result,
        }
        # Send to frontend - run in a new event loop since we're in a callback
        try:
            asyncio.run(send_card(card_data))
        except RuntimeError as e:
            # This might happen if there's already an event loop running
            logger.error(f"Error sending card: {e}")
            # Alternative approach using a new thread
            import threading
            threading.Thread(target=lambda: asyncio.run(send_card(card_data))).start()
    elif verbose:    
        logger.info(f"INTERIM TRANSCRIPT: {transcript.text}")


def process_final_transcript(text: str):
    """Process a final transcript using the context manager."""
    word_count = len(text.split())
    if word_count < 3:
        logger.info(f"Skipping processing for short transcript ({word_count} words): '{text}'")
        return {"status": "skipped", "reason": "transcript too short"}
        
    try:
        # Simpler way to run an async function from sync code
        result = asyncio.run(context_manager.process_text(text))
        logger.info(f"Processing result: {result}")
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