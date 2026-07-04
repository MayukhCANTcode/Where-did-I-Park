const express = require("express");
const router = express.Router();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

router.post("/generate-note", async (req, res) => {

    try {

        const { imageUrl } = req.body;

        if (!imageUrl) {

            return res.status(400).json({
                message: "Image URL is required."
            });

        }

        const prompt = `
You are helping someone remember where they parked.

Look at this parking image.

Generate ONE short parking note.

Rules:
- Maximum 25 words.
- Mention nearby landmarks.
- Mention pillar colors if visible.
- Mention lift numbers if visible.
- Mention gates if visible.
- Mention shops if visible.
- Do not invent information.
- Return only the parking note.
`;

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt
                        },
                        {
                            fileData: {
                                mimeType: "image/jpeg",
                                fileUri: imageUrl
                            }
                        }
                    ]
                }
            ]

        });

        res.json({
            note: response.text
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "AI failed."
        });

    }

});

module.exports = router;