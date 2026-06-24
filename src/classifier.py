from transformers import pipeline


# Load pretrained sentiment classifier
classifier = pipeline("sentiment-analysis")


def classify_text(text):

    result = classifier(text)

    return result


if __name__ == "__main__":

    sample_text = "The company must complete payment within 30 days."

    output = classify_text(sample_text)

    print(output)