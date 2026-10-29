import spacy
import re


class TextProcessor:
    def __init__(self, pdf_path=None, output_path=None):
        self.pdf_path = pdf_path
        self.output_path = output_path
        self.nlp = spacy.load("es_core_news_lg")
        self.sticky_left = {'.', ',', ':', ';', '...', '…', '!', '?', ')', '”', '»'}
        self.sticky_right = {'¿', '¡', '(', '“', '«'}

    def clean_text(self, text: str) -> str:
        """ Procesa el texto eliminando emojis, duplicados y manejando puntuaciones. """
        emoji_pattern = re.compile(
            "["
            "\U0001F600-\U0001F64F"
            "\U0001F300-\U0001F5FF"
            "\U0001F680-\U0001F6FF"
            "\U0001F1E0-\U0001F1FF"
            "\U00002700-\U000027BF"
            "\U0001F900-\U0001F9FF"
            "\U00002600-\U000026FF"
            "]+",
            flags=re.UNICODE
        )
        text = emoji_pattern.sub(r'', text)

        tokens = []
        doc = self.nlp(text)
        prev_text = None

        for token in doc:
            txt = token.text

            if token.is_space or txt == prev_text:
                continue

            if token.is_punct:
                if txt in self.sticky_left and tokens:
                    tokens[-1] += txt
                    continue
                elif txt in self.sticky_right:
                    prev_text = txt
                    continue

            if prev_text in self.sticky_right:
                tokens.append(prev_text + txt)
                prev_text = txt
            else:
                tokens.append(txt)
                prev_text = txt

        return " ".join(tokens)

    def truncate_text(self, text: str=None, max_words: int=100) -> str:
        doc = self.nlp(text)
        sentences = list(doc.sents)

        word_count = 0
        result_sentences = []

        for sentence in sentences:
            words_in_sentence = len([token for token in sentence if not token.is_punct and not token.is_space])

            if word_count + words_in_sentence > max_words:
                break

            result_sentences.append(sentence.text)
            word_count += words_in_sentence

        return ' '.join(result_sentences)
