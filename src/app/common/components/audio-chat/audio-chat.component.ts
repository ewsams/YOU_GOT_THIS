import { Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors'
import { SubResolver } from '../../helpers/sub-resolver'
import { takeUntil } from 'rxjs'
import { FileService } from '../../services/file.service'

@Component({
  selector: 'app-audio-chat',
  templateUrl: './audio-chat.component.html',
  styleUrls: ['./audio-chat.component.scss'],
})
export class AudioChatComponent extends SubResolver {
  public isDarkTheme$ = this._store.select(selectIsDarkTheme)
  public qaHistory: { query: string; answer: string }[] = []
  public query = ''
  public answer = ''
  public isLoadingAnswer = false
  public audioLoading = false
  public audioUploaded = false

  constructor(private _fileService: FileService, private _store: Store) {
    super()
  }

  public onUploadAudio(event: any) {
    this.audioLoading = true
    const audioFile = event.target.files[0]
    this._fileService
      .uploadAudio(audioFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.message === 'Audio file uploaded, summarized, and embedded successfully.') {
          this.audioLoading = false
          this.audioUploaded = true
        }
      })
  }

  public onSubmitQuery() {
    this.isLoadingAnswer = true
    this._fileService
      .queryUploadedAudio(this.query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.answer = res.answer
        this.qaHistory.push({ query: this.query, answer: res.answer })
        this.query = ''
        this.isLoadingAnswer = false
      })
  }

  public resetComponent() {
    this.query = ''
    this.answer = ''
    this.qaHistory = []
    this.audioLoading = false
    this.audioUploaded = false
  }
}
