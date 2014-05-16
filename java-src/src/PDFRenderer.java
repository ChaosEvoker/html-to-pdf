import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

import org.w3c.tidy.Tidy;
import org.xhtmlrenderer.pdf.ITextRenderer;

public class PDFRenderer {

    public static void main(String[] args) throws Exception {

    	//Check to make sure everything is as it should be
    	if (args.length < 2) {
    		throw new Exception("Invalid arguments. Renderer requires a path to an HTML File (source) and a path to a PDF File (destination).");
    	}

        String oldProperty = System.getProperty("java.protocol.handler.pkgs");
        if (oldProperty == null)
        {
            System.setProperty("java.protocol.handler.pkgs", "org.xhtmlrenderer.protocols");
        } else if (!oldProperty.contains("org.xhtmlrenderer.protocols")) {
            System.setProperty("java.protocol.handler.pkgs", oldProperty + "|org.xhtmlrenderer.protocols");
        }

    	//Set up command line arguments
        int filesArgIndex = 0;
        String inputEncoding = "";
        String outputEncoding = "";
        for (int i = 0; i < args.length; i++)
        {
            if (args[i].equals("--input-encoding") && (i < args.length - 1))
            {
                inputEncoding = args[i + 1];
                i++;
                filesArgIndex += 2;
            }
            if (args[i].equals("--output-encoding") && (i < args.length - 1))
            {
                outputEncoding = args[i + 1];
                i++;
                filesArgIndex += 2;
            }
        }
		String inputFile = args[filesArgIndex];
    	String pdfFilePath = args[filesArgIndex + 1];

    	//Set up input file and output file for cleaning up the HTML
        InputStream is = new FileInputStream(inputFile);
        String cleanHTMLFile = "clean.html";
        OutputStream os = new FileOutputStream(cleanHTMLFile);

        //Clean the HTML
        //This is necessary because for flyingsaucer to render the PDF, it
    	//requires well-formatted XHTML or XML (XHTML in our case)
    	Tidy htmlCleaner = new Tidy();
        if (!inputEncoding.isEmpty())
            htmlCleaner.setInputEncoding(inputEncoding);
        if (!outputEncoding.isEmpty())
            htmlCleaner.setOutputEncoding(outputEncoding);
    	htmlCleaner.setXHTML(true);
    	htmlCleaner.parse(is, os);

        //Setup the inputs and outputs for the PDF rendering
    	String url = new File(cleanHTMLFile).toURI().toURL().toString();
        OutputStream outputPDF = new FileOutputStream(pdfFilePath);

        //Create the renderer and point it to the XHTML document
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocument(url);

        //Render the PDF document
        renderer.layout();
        renderer.createPDF(outputPDF);

        //Close the streams (and don't cross them!)
        os.close();
        outputPDF.close();

		//Clean up the temp file
		File tempFile = new File("clean.html");
		tempFile.delete();
    }

}
