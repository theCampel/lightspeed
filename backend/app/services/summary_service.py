import logging
import os
import json
from typing import Dict, Any, List
from datetime import datetime
from openai import OpenAI

logger = logging.getLogger(__name__)


class SummaryService:
    """
    Service to track conversation transcripts and generate structured meeting summaries.
    Stores transcribed sentences and provides functionality to generate meeting summaries.
    """

    def __init__(self):
        """Initialize the summary service with required components."""
        self.conversation_history = []
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )

    def add_transcript(self, text: str) -> None:
        """
        Add a transcript to the conversation history.

        Args:
            text: The transcribed text to add
        """
        if not text or len(text.strip()) == 0:
            return

        self.conversation_history.append(
            {"timestamp": datetime.now().isoformat(), "text": text}
        )
        logger.info(
            f"Added transcript to history. Total entries: {len(self.conversation_history)}"
        )

    def get_full_conversation(self) -> str:
        """
        Get the full conversation as a single string.

        Returns:
            The full conversation history as a string
        """
        return "\n".join(
            [entry["text"] for entry in self.conversation_history]
        )

    async def generate_meeting_summary(
        self, meeting_date: str = None
    ) -> Dict[str, Any]:
        """
        Generate a structured meeting summary from the conversation history.

        Args:
            meeting_date: Optional date string for the meeting (defaults to today)

        Returns:
            A structured summary in JSON format
        """
        if not self.conversation_history:
            logger.warning("No conversation history to summarize")
            return {
                "error": "No conversation history available for summarization"
            }

        # Use today's date if not provided
        if not meeting_date:
            meeting_date = datetime.now().strftime("%B %d, %Y")

        full_conversation = self.get_full_conversation()
        logger.info(
            f"Generating summary for conversation with {len(self.conversation_history)} entries"
        )

        # Create a prompt for generating the structured summary
        prompt = f"""
        Generate a structured meeting summary from the following financial advisor and client conversation:
        
        {full_conversation}
        
        Create a JSON summary with the following structure:
        {{
            "meeting_summary": "Meeting Summary: {meeting_date}",
            "discussion_points": [
                // List of key discussion points from the conversation (1-5 bullet points)
            ],
            "action_items": [
                // List of action items identified from the conversation (1-5 items if applicable)
            ],
            "investment_goal_changes": [
                // List of any investment goal changes discussed (if applicable)
            ]
        }}
        
        The summary should be comprehensive but concise, focusing on:
        1. Key financial topics discussed
        2. Specific action items that were agreed upon
        3. Any changes to investment goals or risk tolerance
        
        Respond with ONLY the JSON object, nothing else.        """

        try:
            # Call the Qwen model to generate the summary
            completion = self.client.chat.completions.create(
                model="openai/gpt-4o-mini",  # Using Qwen 32b model
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
            )

            # Parse the response
            response_content = completion.choices[0].message.content
            summary_data = json.loads(response_content)

            logger.info("Successfully generated meeting summary")
            return summary_data

        except Exception as e:
            logger.error(f"Error generating meeting summary: {e}")
            return {
                "error": f"Failed to generate meeting summary: {str(e)}",
                "meeting_summary": f"Meeting Summary: {meeting_date}",
                "discussion_points": ["Error generating summary"],
                "action_items": [],
                "investment_goal_changes": [],
            }


# Create a global instance for use across the application
summary_service = SummaryService()