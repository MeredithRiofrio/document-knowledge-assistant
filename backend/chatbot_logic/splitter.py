import re
import uuid


class CustomSplitter:
    def __init__(self, text: str, chunk_size: int = 2000):
        self.text = text
        self.segments = re.split(r'(?<=\.)\s*\n', self.text)
        self.chunk_size = chunk_size

    def split_text(self) -> list[tuple[str, str]]:
        chunks_with_ids = []
        buffer = ""

        for segment in self.segments:
            segment = segment.strip()
            if not segment:
                continue

            if len(segment) >= self.chunk_size:
                if buffer.strip():
                    chunk = buffer.strip()
                    chunks_with_ids.append((uuid.uuid4().hex, chunk))
                    buffer = ""
                chunks_with_ids.append((uuid.uuid4().hex, segment))
            elif len(buffer) + len(segment) < self.chunk_size:
                buffer += segment + "\n"
            else:
                chunk = buffer.strip()
                chunks_with_ids.append((uuid.uuid4().hex, chunk))
                buffer = segment + "\n"

        if buffer.strip():
            chunks_with_ids.append((uuid.uuid4().hex, buffer.strip()))

        return chunks_with_ids

