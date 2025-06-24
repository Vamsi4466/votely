import { Component, OnInit, inject } from '@angular/core';
import { PollCardComponent } from '../../components/poll-card/poll-card.component';
import { PollCardConfig } from '../../interfaces/ui-config/poll-card-config.interface';
import { ToastrService } from 'ngx-toastr';
import { PollService } from '../../services/poll.service';
import { AuthService } from '../../services/auth.service';
import { CreatePoll, CreatePollVoters } from '../../interfaces/models/create-poll.interface';
import { EmptyCardComponent } from '../../components/empty-card/empty-card.component';

@Component({
  selector: 'app-my-polls',
  standalone: true,
  imports: [PollCardComponent, EmptyCardComponent],
  templateUrl: './my-polls.component.html',
  styleUrl: './my-polls.component.scss'
})
export class MyPollsComponent implements OnInit {
  cards: PollCardConfig[] = [];
  pollSubscription: any;
  toast = inject(ToastrService);

  constructor(private pollService: PollService, private authService: AuthService) {}

  ngOnInit(): void {
    const currentUserId = this.authService.getCurrentUser().uid ?? '';
    
    this.pollService.polls.subscribe((res: CreatePoll[]) => {
  if (res && res !== undefined) {
    this.cards = (res as CreatePoll[])
      .filter((item: CreatePoll) => item.isActive !== false)
      .map((item: CreatePoll) => {
        const isOwner = currentUserId === item.ownerId;

        const voterIndex = item.voters.findIndex(
          (voter: CreatePollVoters) => voter.userId === currentUserId
        );
        const hasVoted = isOwner ? false : voterIndex >= 0;

        return {
          dateCreated: item.createdDate,
          id: item.pollId,
          title: item.title,
          options: item.options,
          isOwner: isOwner,
          hasVoted: hasVoted,
          totalVotes: item.voters.length
        } as PollCardConfig;
      });
  }
});

    this.pollService.getPolls(true)

  }

  handleDelete(pollId: string) {
  this.pollService.deletePollById(pollId).then(() => {
    this.toast.success('You have successfully deleted a poll');
    this.pollService.getPolls(true); // re-fetch data
  }).catch((error: any) => {
    console.error(error);
    this.toast.error('Issue occurred while trying to delete a poll');
  });
}

}