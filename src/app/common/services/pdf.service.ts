import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PdfTokenCount } from '../models/pdf-token-count.model';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private apiUrl = environment.flaskUrl;

  constructor(private _http: HttpClient) {}

  public countTokensWithEncoding(
    text: string,
    encoding_name: string
  ): Observable<PdfTokenCount> {
    return this._http.post<PdfTokenCount>(`${this.apiUrl}/api/count-tokens`, {
      text,
      encoding_name,
    });
  }

  public async extractTextContent(pdfDoc: any): Promise<string> {
    const totalPages = pdfDoc.numPages;
    const pageTextPromises = [];

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => item.str);
      const textStr = textItems.join(' ');
      pageTextPromises.push(textStr);
    }

    const allPagesText = await Promise.all(pageTextPromises);
    return allPagesText.join('\n');
  }

  public countWords(text: string): number {
    const words = text.match(/\b(\w+)\b/g);
    return words ? words.length : 0;
  }

  public formatFileSize(size: number): string {
    if (size < 1024) {
      return size + ' B';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
  }

  public getMetricExplanation(key: string): string {
    const explanations: { [key: string]: string } = {
      pageCount:
        "The total number of pages in the PDF document. This information is useful when preparing the document for vector embedding, as it gives an indication of the document's size and complexity. Additionally, it can be helpful for text segmentation and preprocessing tasks before generating embeddings.",
      title:
        'The title of the PDF document, which can be used as metadata when generating vector embeddings and for document organization. The title can also help with search and retrieval tasks, allowing users to find documents based on their topic or content.',
      author:
        "The author of the PDF document, which can be used as metadata when generating vector embeddings and for document organization. Identifying the author can enable the analysis of an individual's writing style or the comparison of works from different authors.",
      subject:
        'The subject of the PDF document, which can be used as metadata when generating vector embeddings and for document organization. Understanding the subject can aid in content classification, topic modeling, and the identification of similar or related documents.',
      fileSize:
        'The size of the PDF document file, which can impact the time and resources required for processing and generating vector embeddings. Larger files may necessitate more powerful hardware or increased memory allocation, affecting overall system performance.',
      wordCount:
        "The total number of words in the PDF document, which provides an estimate of the document's content size and can be used to optimize the vector embedding process. A higher word count may require adjustments to the embedding parameters, such as window size or learning rate, to ensure effective representation of the content.",
      encodingName:
        'The selected encoding used for tokenization, which can influence the quality of the generated vector embeddings by affecting how tokens are identified and processed. Different encodings may yield varying results depending on the language and structure of the document, making it essential to choose the most suitable encoding for the task at hand.',
      tokenCount:
        'The total number of tokens in the PDF document based on the selected encoding. This information is essential for generating vector embeddings, as each token will be mapped to a vector in the embedding space. The token count also serves as an indicator of the processing complexity and resources needed for tasks such as similarity computation and clustering.',
      cost: 'The estimated cost to process the PDF document based on token count and selected encoding. This includes the time and resources required for generating vector embeddings, tokenization, and other related processing tasks. Estimating the cost can help in planning and optimizing system resources for efficient processing of large collections of documents.',
    };

    return explanations[key] || '';
  }
}
