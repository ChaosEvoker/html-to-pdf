import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLStreamHandlerFactory;
import java.net.URLStreamHandler;

import java.util.UUID;

import org.w3c.tidy.Tidy;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.xhtmlrenderer.protocols.data.Handler;

class DataURLStreamHandlerFactory implements URLStreamHandlerFactory {
    public URLStreamHandler createURLStreamHandler(String protocol) {
        if (protocol.equalsIgnoreCase("data"))
            return new Handler();
        else
            return null;
    }
}

public class PDFRenderer {

    public static void main(String[] args) throws Exception {

    	//Check to make sure everything is as it should be
    	if (args.length < 2) {
    		throw new Exception("Invalid arguments. Renderer requires a path to an HTML File (source) and a path to a PDF File (destination).");
    	}
        try {
            URL.setURLStreamHandlerFactory(new DataURLStreamHandlerFactory());
        } catch (Error e) {
            System.out.println("The Stream Handler Factory is already defined. Moving on to convert to PDF.");
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
        UUID uniqueID = UUID.randomUUID();
        String cleanHTMLFile = uniqueID.toString() + ".html";
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
		File tempFile = new File(uniqueID.toString() + ".html");
		tempFile.delete();
    }

}
