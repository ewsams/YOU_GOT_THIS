import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { selectIsDarkTheme } from 'src/app/store/theme/theme.selectors'
import { SubResolver } from '../../helpers/sub-resolver'
import { switchMap, takeUntil, tap } from 'rxjs'
import { FileService } from '../../services/file.service'
import { selectUserId } from 'src/app/store/auth/auth.selectors'
import * as mongoose from 'mongoose'

@Component({
  selector: 'app-audio-chat',
  templateUrl: './audio-chat.component.html',
  styleUrls: ['./audio-chat.component.scss'],
})
export class AudioChatComponent extends SubResolver implements OnInit {
  public isDarkTheme$ = this._store.select(selectIsDarkTheme)
  public userId$ = this._store.select(selectUserId)
  public qaHistory: { query: string; answer: string }[] = []
  public query = ''
  public answer = ''
  public isLoadingAnswer = false
  public audioLoading = false
  public audioUploaded = false
  public embeddings: any
  public userId: string | undefined

  constructor(private _fileService: FileService, private _store: Store) {
    super()
  }
  ngOnInit(): void {
    this.getUserId()
  }

  public onUploadAudio(event: any) {
    this.audioLoading = true
    const audioFile = event.target.files[0]
    this._fileService
      .uploadAudio(audioFile)
      .pipe(
        takeUntil(this.destroy$),
        tap((audio) => {
          if (audio.message === 'Audio file uploaded, summarized, and embedded successfully.') {
            this.audioLoading = false
            this.audioUploaded = true
            this.embeddings = audio.embedded_audio_summary
          }
        }),
        switchMap((audio) => {
          if (audio.message === 'Audio file uploaded, summarized, and embedded successfully.') {
            const newChatId = new mongoose.Types.ObjectId() // Generate a new ObjectId for chatId
            return this._fileService.createQaHistory({
              userId: this.userId as string,
              chatId: newChatId.toHexString(), // Convert the ObjectId to a hex string
              qa: [],
              embeddingsUrl: '',
            })
          } else {
            throw new Error('Failed to upload audio')
          }
        }),
      )
      .subscribe()
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

  public getUserId(): void {
    this.userId$.subscribe((userId) => {
      this.userId = userId as string
    })
  }
}
