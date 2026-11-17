import asyncio
import os
import shutil
import sys
import tempfile
from pathlib import Path

import edge_tts

PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "scripts" / "system-voices"

# Prefer an explicitly configured path; otherwise, discover FFmpeg through PATH.
FFMPEG = Path(os.environ.get("FFMPEG_PATH") or shutil.which("ffmpeg") or "")

VOICES = {
    "Aaron": (
        "en-US-ChristopherNeural",
        (
            "Take a moment to slow down and breathe. Every day is an opportunity "
            "to understand yourself a little better. Progress does not need to be "
            "rushed. Give yourself the patience and kindness you deserve."
        ),
    ),
    "Abigail": (
        "en-US-AvaNeural",
        (
            "Hey there! It's lovely to have you here. Let's make this conversation "
            "easy and enjoyable. Whether you have a question, an idea, or simply "
            "something to share, I'm always happy to help."
        ),
    ),
    "Anaya": (
        "en-IN-NeerjaNeural",
        (
            "Namaste! Thank you for reaching out. I'm here to help you with your "
            "query. Please take your time and explain what you need. We will go "
            "through everything step by step and find the right solution."
        ),
    ),
    "Andy": (
        "en-US-AndrewNeural",
        (
            "Welcome! In this recording, we're exploring a few everyday ideas. "
            "Clear communication makes information easier to understand. "
            "Let's keep things simple, useful, and straightforward."
        ),
    ),
    "Archer": (
        "en-GB-RyanNeural",
        (
            "Beyond the edge of the familiar world, a new story was waiting. "
            "The road ahead was uncertain, but every step brought another "
            "discovery. And so, with quiet determination, the journey began."
        ),
    ),
    "Brian": (
        "en-US-BrianNeural",
        (
            "Wait a second. Did you hear that? I thought this was going to be "
            "an ordinary afternoon, but something tells me we're about to have "
            "a very unusual adventure. Let's find out what's happening."
        ),
    ),
    "Chloe": (
        "en-GB-LibbyNeural",
        (
            "Settle into a comfortable position and allow your shoulders to relax. "
            "Notice the gentle rhythm of your breathing. There is nothing you "
            "need to solve right now. Simply give yourself a quiet moment."
        ),
    ),
    "Dylan": (
        "en-US-GuyNeural",
        (
            "You've got more potential than you realise. Start where you are, "
            "use what you have, and take that first step. Small actions, repeated "
            "consistently, can create extraordinary results. Keep moving forward."
        ),
    ),
    "Emmanuel": (
        "en-US-EricNeural",
        (
            "Welcome back to the show. Today we're taking a closer look at how "
            "technology is changing the way we work, communicate, and create. "
            "Let's explore the ideas, the challenges, and the opportunities."
        ),
    ),
    "Ethan": (
        "en-US-RogerNeural",
        (
            "Discover a smarter way to make every day count. Designed for your "
            "pace and built around what matters, this is an experience that helps "
            "you do more with less effort. Make your next move today."
        ),
    ),
    "Evelyn": (
        "en-US-MichelleNeural",
        (
            "Professional communication begins with clarity and confidence. "
            "Every message should feel natural, informative, and engaging. "
            "The right words help ideas connect with the people who matter."
        ),
    ),
    "Gavin": (
        "en-GB-ThomasNeural",
        (
            "Good morning, everyone. Thank you for joining today's business "
            "update. We will review our progress, discuss the priorities ahead, "
            "and identify the actions required to deliver our shared objectives."
        ),
    ),
    "Gordon": (
        "en-AU-WilliamMultilingualNeural",
        (
            "There are stories that deserve to be told slowly, with care and "
            "attention. In the pages of history, we discover the choices, "
            "struggles, and quiet triumphs that shaped the world around us."
        ),
    ),
    "Ivan": (
        "en-US-SteffanNeural",
        (
            "It's good to see you. Let's take a practical approach and work "
            "through this together. You can ask questions whenever something "
            "is unclear. We'll keep the conversation relaxed and useful."
        ),
    ),
    "Laura": (
        "es-ES-ElviraNeural",
        (
            "Hola, gracias por contactar con nuestro equipo de atención. "
            "Estoy aquí para ayudarte. Cuéntame qué necesitas y revisaremos "
            "juntos las opciones disponibles para encontrar una solución."
        ),
    ),
    "Lucy": (
        "en-AU-NatashaNeural",
        (
            "Hello and welcome! It's a beautiful day to learn something new. "
            "A little curiosity can take you a long way. Let's explore a few "
            "ideas and see where the conversation takes us."
        ),
    ),
    "Madison": (
        "en-US-AriaNeural",
        (
            "She stood at the doorway, listening to the silence. Somewhere "
            "beyond the hills, a distant light flickered. She knew the truth "
            "would change everything, but turning back was no longer an option."
        ),
    ),
    "Marisol": (
        "es-MX-DaliaNeural",
        (
            "Cierra los ojos por un momento y respira tranquilamente. "
            "Deja que tus pensamientos pasen sin prisa. Este momento es para ti. "
            "Descansa, relájate y disfruta de esta pausa."
        ),
    ),
    "Meera": (
        "en-IN-PrabhatNeural",
        (
            "Every new beginning brings a chance to grow. Believe in your "
            "abilities, celebrate your progress, and keep your goals in sight. "
            "With patience and consistent effort, you can achieve meaningful "
            "things."
        ),
    ),
    "Walter": (
        "en-US-AndrewMultilingualNeural",
        (
            "Ladies and gentlemen, let me begin with our strategic direction. "
            "Our focus remains on sustainable growth, operational excellence, "
            "and delivering long-term value. Together, we can turn this vision "
            "into measurable results."
        ),
    ),
}


async def generate_one(name, voice, text, temp_dir):
    mp3_path = temp_dir / f"{name}.mp3"
    wav_path = OUTPUT_DIR / f"{name}.wav"

    await edge_tts.Communicate(text, voice).save(str(mp3_path))

    command = [
        str(FFMPEG),
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        str(mp3_path),
        "-ac",
        "1",
        "-ar",
        "24000",
        "-c:a",
        "pcm_s16le",
        str(wav_path),
    ]

    process = await asyncio.create_subprocess_exec(
        *command,
        stdout=asyncio.subprocess.DEVNULL,
        stderr=asyncio.subprocess.PIPE,
    )

    _, stderr = await process.communicate()

    if process.returncode != 0:
        error_message = stderr.decode(errors="replace").strip()
        raise RuntimeError(
            f"{name}: FFmpeg conversion failed "
            f"(exit code {process.returncode}): {error_message}"
        )

    if not wav_path.is_file() or wav_path.stat().st_size == 0:
        raise RuntimeError(f"{name}: WAV output is missing or empty")

    print(f"[OK] {name}.wav ({wav_path.stat().st_size:,} bytes)")


async def main():
    if not FFMPEG.is_file():
        raise FileNotFoundError(
            f"FFmpeg not found: {FFMPEG}. "
            "Install FFmpeg and add it to PATH, or set FFMPEG_PATH."
        )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Generating {len(VOICES)} synthetic reference samples...")
    print(f"Output: {OUTPUT_DIR}")
    print("Format: WAV, 24 kHz, mono, 16-bit PCM")
    print()

    failures = []

    with tempfile.TemporaryDirectory(prefix="resonance-voices-") as temp:
        temp_dir = Path(temp)

        for name, (voice, sample_text) in VOICES.items():
            try:
                await generate_one(name, voice, sample_text, temp_dir)
            except Exception as exc:  # noqa: BLE001
                # Keep processing other voices when one sample fails.
                failures.append((name, str(exc)))
                print(f"[FAILED] {name}: {exc}")

    print()
    print(f"Completed: {len(VOICES) - len(failures)}/{len(VOICES)}")

    if failures:
        print("Failed samples:")
        for name, error in failures:
            print(f"  - {name}: {error}")
        sys.exit(1)

    print(f"All {len(VOICES)} WAV files generated successfully.")


if __name__ == "__main__":
    asyncio.run(main())
