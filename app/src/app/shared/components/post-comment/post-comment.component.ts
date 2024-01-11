import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsDataService } from '../../services';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
})
export class PostCommentComponent implements OnInit {
  @Input() itemComment: any = {
    comment: '',
  };
  @Input() valueComment: { name: string; id: string } = {
    name: '',
    id: '',
  };
  @Input() isSendSuccess: boolean = false;
  @Output() submitComment: EventEmitter<any> = new EventEmitter();
  @Output() removeComment: EventEmitter<boolean> = new EventEmitter();

  form: FormGroup;
  images: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private newsDataService: NewsDataService
  ) {
    this.form = this.formBuilder.group({
      comment: [this.valueComment.name, [Validators.required]],
      // mentions: [null]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.form.controls['comment'].patchValue(
      changes['valueComment']?.currentValue?.name
    );
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
  }

  // get xxx() {
  //   return this.form.controls['comment'].patchValue(this.valueComment.name);
  // }

  ngOnInit(): void {}

  setCoverImage(event: any) {
    //call api onSelectFile để get http image sau đó push vào this.images
    console.log(event.target.files);
    this.images.push(event.target.files);
  }

  removeImage(index: number) {
    this.images.splice(index, 1);

    console.log(this.images);
  }
  handleSendComment() {
    const object = {
      images: this.images,
      comment: this.form.value.comment,
      idComment: this.itemComment?.id ?? undefined,
    };
    console.log(object);
    this.submitComment.emit(object);
    if (this.isSendSuccess) {
      this.itemComment = { comment: '' };
      this.images = [];
      this.form.reset();
    }
  }

  removeCommentReply() {
    this.removeComment.emit(true);
  }
}
