import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PdfTokenCount } from '../models/pdf-token-count.model';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private apiUrl = 'http://127.0.0.1:5000';

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
      pageCount: 'The total number of pages in the PDF document.',
      title: 'The title of the PDF document.',
      author: 'The author of the PDF document.',
      subject: 'The subject of the PDF document.',
      fileSize: 'The size of the PDF document file.',
      wordCount: 'The total number of words in the PDF document.',
      encodingName: 'The selected encoding used for tokenization.',
      tokenCount:
        'The total number of tokens in the PDF document based on the selected encoding.',
      cost: 'The estimated cost to process the PDF document based on token count and selected encoding.',
    };

    return explanations[key] || '';
  }
}
