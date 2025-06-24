import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PollCardConfig } from '../../interfaces/ui-config/poll-card-config.interface';
import { CreatePollVoters } from '../../interfaces/models/create-poll.interface';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poll-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './poll-card.component.html',
  styleUrl: './poll-card.component.scss'
})
export class PollCardComponent {

  @Input() config!: PollCardConfig;
  @Input() isAdmin: boolean = false;
  @Output() vote: EventEmitter<{voter: CreatePollVoters, pollId: string}> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();

  selectedIndex: number = -1

  voterOption!: CreatePollVoters;

  constructor(private authService: AuthService) {}



  percentage(count: number){
    return this.config.totalVotes ===0 ? 0 : Math.round(((count / this.config.totalVotes) * 100));
  }

  selectedOption(index: number) {
  this.selectedIndex = index;
  const currentUser = this.authService.getCurrentUser();
  this.authService.getUserFromDB(currentUser.uid).then((res: any) => {
    this.voterOption = {
      name: this.config.options[index].name,
      optionId: index,
      userId: currentUser.uid,
      userName: res.fullName
    };
  });
}


  handleVote() {
  if (!this.voterOption) {
    const currentUser = this.authService.getCurrentUser();
    this.authService.getUserFromDB(currentUser.uid).then((res: any) => {
      this.voterOption = {
        name: this.config.options[this.selectedIndex].name,
        optionId: this.selectedIndex,
        userId: currentUser.uid,
        userName: res.fullName
      };
      this.vote.emit({ voter: this.voterOption, pollId: this.config.id });
    });
  } else {
    this.vote.emit({ voter: this.voterOption, pollId: this.config.id });
  }
}

  handleDelete() {
    this.delete.emit();
  }
  
}