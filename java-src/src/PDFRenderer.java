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

    	//Set up command line arguments
		String inputFile = args[0];
    	String pdfFilePath = args[1];

    	//Set up input file and output file for cleaning up the HTML
        InputStream is = new FileInputStream(inputFile);
        String cleanHTMLFile = "clean.html";
        OutputStream os = new FileOutputStream(cleanHTMLFile);

        //Clean the HTML
        //This is necessary because for flyingsaucer to render the PDF, it
    	//requires well-formatted XHTML or XML (XHTML in our case)
    	Tidy htmlCleaner = new Tidy();
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
