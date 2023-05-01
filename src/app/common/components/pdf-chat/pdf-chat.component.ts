import { Component } from '@angular/core'
import { PdfService } from '../../services/pdf.service'
import { Store } from '@ngrx/store'
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors'
import { SubResolver } from '../../helpers/sub-resolver'
import { takeUntil } from 'rxjs'

@Component({
  selector: 'app-pdf-chat',
  templateUrl: './pdf-chat.component.html',
  styleUrls: ['./pdf-chat.component.scss'],
})
export class PdfChatComponent extends SubResolver {
  public isDarkTheme$ = this._store.select(selectIsDarkTheme)
  public query = ''
  public answer = ''

  constructor(private _pdfService: PdfService, private _store: Store) {
    super()
  }

  public onUploadPdf(event: any) {
    const pdfFile = event.target.files[0]
    this._pdfService.embedAndUploadPdf(pdfFile).pipe(takeUntil(this.destroy$)).subscribe()
  }

  public onSubmitQuery() {
    this._pdfService
      .queryEmbeddedPdf(this.query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.answer = res.answer
      })
  }
}
