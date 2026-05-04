const MY_MEMORY_API = "https://api.mymemory.translated.net/";

export const getTranslation = async (text: string) => {
  try {
    const response = await fetch(
      `${MY_MEMORY_API}get?q=${encodeURIComponent(text)}&langpair=sv|en`,
    );

    const data = await response.json();
    if (data.responseStatus === 200) {
        const cleaned = data.responseData.translatedText.replace(/<[^>]*>/g, "")
            return cleaned
    }

    return text;
  } catch (err) {
    console.error("Error translating text: ", err);
    throw err;
  }
};
