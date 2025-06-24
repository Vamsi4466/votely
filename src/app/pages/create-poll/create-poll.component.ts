import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimesCircle, faPlus} from '@fortawesome/free-solid-svg-icons'
import { PollCardOption } from '../../interfaces/ui-config/poll-card-config.interface';
import { CreatePoll } from '../../interfaces/models/create-poll.interface';
import { AuthService } from '../../services/auth.service';
import { PollService } from '../../services/poll.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create-poll',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './create-poll.component.html',
  styleUrl: './create-poll.component.scss'
})
export class CreatePollComponent implements OnInit {
  faTimesCircle = faTimesCircle;
  faPlus=faPlus;
  toastr = inject(ToastrService)
  pollForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    options: this.fb.array<FormGroup<any>>([] as FormGroup[])
  });
  constructor(private fb: FormBuilder, private authService: AuthService, private pollService: PollService) {}


  ngOnInit(): void {
      this.addOption();
      this.addOption();
  }

  get options () {
    return this.pollForm.controls['options'] as FormArray;
  }

  getGroup(index: number): FormGroup<any> {
    return (this.pollForm.controls['options'] as any).controls[index] as FormGroup<any>
    //return this.options.controls[index]
  }


  addOption() {
    this.options.push(this.fb.group({
      option: ['', Validators.required]
    }))
  }


  removeOption(index: number) {
    this.options.controls.splice(index, 1);
  }

  resetForm () {
    this.pollForm = this.fb.group({
      title: ['', Validators.required],
      options: this.fb.array<FormGroup<any>>([] as FormGroup[])
    });
    this.addOption();
    this.addOption();
    
  }
  handleCreatePoll() {
    
    const pollOptions = this.pollForm.value.options?.map((item: any) =>{
      const options = {
        name: item.option,
        count: 0
      }

      return options as PollCardOption
    }) as PollCardOption[]


    const pollCard: CreatePoll ={
      title: this.pollForm.value.title ?? '',
      options: pollOptions,
      ownerId: this.authService.getCurrentUser().uid ?? '',
      voters: [],
      createdDate: new Date(),
      isActive: true
    }

    this.pollService.addPoll(pollCard).then(() => {
      this.toastr.success('Successfully create a new poll');
      this.resetForm();
    }).catch((error) =>{
      console.error(error);
      this.toastr.error('Failed to create a poll')
    })
  }



}