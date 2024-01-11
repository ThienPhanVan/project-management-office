import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'],
})
export class ReportFormComponent implements OnInit {
  @Output() getValues = new EventEmitter();
  @Output() close = new EventEmitter();

  form: FormGroup;
  change: number = 0;

  array = [
    {
      value: 1,
      name: 'Bạo lực',
    },
    {
      value: 2,
      name: 'Đồi trụy',
    },
    {
      value: 3,
      name: 'Quấy rối',
    },
    {
      value: 4,
      name: 'Phản động',
    },
    {
      value: 5,
      name: 'Thông tin sai sự thật',
    },
    {
      value: 6,
      name: 'Trái pháp luật',
    },
    {
      value: 7,
      name: 'Ngôn từ không phù hợp',
    },
    {
      value: 8,
      name: 'Vấn đề khác',
    },
  ];
  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void { }

  onChange(event: any) {
    this.change = event.detail.value;

    if (Number(event.detail.value) !== 8) {
      const obj = this.array.find(
        (el: any) => el.value === Number(event.detail.value)
      );
      this.form.controls['description'].patchValue(obj?.name);
    } else { this.form.controls['description'].patchValue(''); }
  }
  onCloseModal(value: boolean) {
    this.close.emit(value);
  }
  submit() {
    this.getValues.emit(this.form.value);
  }
}
