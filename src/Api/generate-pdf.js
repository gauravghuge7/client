import formidable from 'formidable';
import { readFileSync } from 'fs';
import { PDFDocument } from 'pdf-lib';
import { Configuration, OpenAIApi } from 'openai';
// import path from 'path';

// Disable body parsing by Next.js
export const config = {
   api: {
      bodyParser: false,
   },
};

const openai = new OpenAIApi(
   new Configuration({
      apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in an .env.local file
   })
);

export default async function handler(req, res) {
   if (req.method === 'POST') {
      try {
         // Parse the uploaded file
         const form = new formidable.IncomingForm();
         form.uploadDir = './uploads'; // Ensure this folder exists
         form.keepExtensions = true;

         form.parse(req, async (err, fields, files) => {
            if (err) {
               console.error('Error parsing file:', err);
               return res.status(500).json({ error: 'Error parsing file' });
            }

         const file = files.pdfFile;
         if (!file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
         }

         // Read the uploaded PDF content
         const pdfBuffer = readFileSync(file.filepath);

         // Optionally extract text from the PDF (for example using a library like pdf-parse)
         // Here we simply pass placeholder content to OpenAI.
         const pdfText = 'Placeholder: Text from uploaded PDF';

         // Use OpenAI to generate content
         const aiResponse = await openai.createCompletion({
            model: 'text-davinci-003', // Adjust model as needed
            prompt: `Generate a summary for the following content:\n${pdfText}`,
            max_tokens: 500,
         });

         const generatedText = aiResponse.data.choices[0]?.text || 'Error generating text';

         // Create a new PDF with the generated text
         const pdfDoc = await PDFDocument.create();
         const page = pdfDoc.addPage([600, 800]);
         const font = await pdfDoc.embedFont(PDFDocument.PDFName.StandardFonts.Helvetica);
         const fontSize = 12;

         // Draw the generated content onto the PDF
         const lines = generatedText.split('\n');
         let y = 750; // Start writing at the top
         lines.forEach((line) => {
            page.drawText(line, { x: 50, y, size: fontSize, font });
            y -= fontSize + 5; // Move down for the next line
         }); 

         // Serialize the PDF
         const newPdfBytes = await pdfDoc.save();

         // Return the new PDF as a downloadable file
         res.setHeader('Content-Type', 'application/pdf');
         res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
         res.send(newPdfBytes);
         });
   } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      }
   } 
   else {
      return res
      .setHeader('Allow', ['POST'])
      .status(405).json({ error: `Method ${req.method} Not Allowed` });
   }
}
