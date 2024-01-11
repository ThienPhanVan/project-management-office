import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MESSAGE_STATUS } from '../../constant';
import { IAttachment, IMessage } from '../../interface';
import * as _ from 'lodash';

interface User {
  id: string;
  username: string;
}

@Component({
  selector: 'app-thread',
  templateUrl: './thread.page.html',
  styleUrls: ['./thread.page.scss'],
})
export class ThreadPage implements OnInit {

  user!: User;

  originGroup: any = {
    'id': '2',
    'name': 'GCE',
    'href': '/tabs/connect/group/2'
  }

  messages! :IMessage[]

//   messages:IMessage[] = [{
//     "id": 1,
//     "content": "Không ngại khó khăn và thử thách: Chủ động là không ngại khó khăn và thử thách. Khi bạn gặp khó khăn, hãy tìm cách vượt qua chúng và đừng bao giờ bỏ cuộc.",
//     "user_id": '04cb5fe9-3c6f-4ac4-a5d4-dc84e6824143',
//     "time": "7:30",
//     "replies": [],
//     "emojis": []

//   },
// {
//   "id": 2,
//   "content": "Sẵn sàng đưa ra ý kiến và đóng góp cho tập thể: Người chủ động luôn sẵn sàng đưa ra ý kiến và đóng góp cho tập thể. Họ là những người có thể suy nghĩ độc lập",
//   "user_id": '04cb5fe9-3c6f-4ac4-a5d4-dc84e6824143',
//   "time": "8:30",
//   "replies": [],
//   "emojis": []

// }]

  constructor(
    private location: LocationStrategy
  ) { }

  
  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  }

  back() {
    this.location.back();
  }

  sendMessage(event:any) {
    const newMessage = event.newMessage;
    const selectedAttachments = event.selectedAttachments;
    if (newMessage || selectedAttachments) {
      const formatedMessage = {
        id: 'asd',
        content: newMessage,
        attachments: selectedAttachments,
        user_id: this.user.id,
        created_by: this.user.id,
        time: moment().format('hh:mm').toString(),
        status: MESSAGE_STATUS.SENT,
        replies: [],
        emojis: [],
      };

      this.messages = [...this.messages, formatedMessage];

     
      setTimeout(() => {
        this.messages = this.messages.map((message) =>
          message.status === MESSAGE_STATUS.SENT
            ? { ...message, status: MESSAGE_STATUS.DELIVERED }
            : message
        );
        console.log(formatedMessage)
      }, 1500);
    }
  }

  getAllImages() {
    let attachments: IAttachment[] = [];
    _.map(this.messages, (message) => {
      if (!_.isNil(message.attachments)) {
        attachments = [...attachments, ...message.attachments];
      }
    });

    return attachments.filter((attachment: IAttachment) => {
      return attachment.type === 'image';
    });
  }

  showDataImage = {
    index: 0,
    images: [] as string[],
  };
  showZoomModal: boolean = false;
  imagesString: string = '';

  onImageClicked(image: IAttachment) {
    const images = this.getAllImages();
    const imagesContent = _.map(images, (img)=>{
      return String(img.content)
    })
    const imageIndex = _.indexOf(_.map(images, 'name'), image.name);
    this.showDataImage = {
      index: imageIndex,
      images: imagesContent,
    }
    this.showZoomModal = true;
    this.imagesString = String(image.content);
  }

  closeModal(value: boolean) {
    this.showZoomModal = value;
    this.imagesString = '';
  }

}
