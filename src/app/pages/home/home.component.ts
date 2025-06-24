import { Component, OnInit, inject } from '@angular/core';
import { PollCardConfig } from '../../interfaces/ui-config/poll-card-config.interface';
import { ToastrService } from 'ngx-toastr';
import { PollService } from '../../services/poll.service';
import { AuthService } from '../../services/auth.service';
import { CreatePoll, CreatePollVoters } from '../../interfaces/models/create-poll.interface';
import { PollCardComponent } from '../../components/poll-card/poll-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PollCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  cards: PollCardConfig[] = [];
  pollSubscription: any;
  toast = inject(ToastrService);
  profilePic: string | null = null;


  constructor(private pollService: PollService, private authService: AuthService) {}

  ngOnInit(): void {
    const currentUserId = this.authService.getCurrentUser().uid ?? '';
    
    this.pollService.polls.subscribe((res: CreatePoll[]) => {

      if (res && res!=undefined){
        this.cards = (res as CreatePoll[]).map((item: CreatePoll) =>{
          const isOwner = currentUserId === item.ownerId;

          const voterIndex = item.voters.findIndex((voter: CreatePollVoters) => voter.userId === currentUserId)
          const hasVoted = isOwner ? false: (voterIndex >= 0);
          return {
            dateCreated: item.createdDate,
            id: item.pollId,
            title:  item.title,
            options: item.options,
            isOwner: isOwner,
            hasVoted: hasVoted,
            totalVotes: (item.voters as [] ).length
          } as PollCardConfig
        }) 


      } 
    });
    this.pollService.getPolls(false)



    

  }


  handleVote($event: {voter: CreatePollVoters, pollId: string}){
    this.pollService.pollVote($event).then(() =>{
      this.toast.success('Your vote has been successfully submitted');
    }).catch((error) =>{
      this.toast.error('Issue occured when trying to vote');
    })
  } 

}