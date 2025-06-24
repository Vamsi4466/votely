import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CreatePoll, CreatePollVoters } from '../interfaces/models/create-poll.interface';
import { Firestore, addDoc, arrayUnion, collection, doc, getDoc, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class PollService {
  DB_POLLS = 'polls';

  public polls: Subject<CreatePoll[]> = new Subject<CreatePoll[]>();
  currentPolls: CreatePoll[] = [];

  constructor(private firestore: Firestore, private authService: AuthService) { }


  async addPoll (data: CreatePoll){
    const collectionRef = collection(this.firestore,this.DB_POLLS);
    return await addDoc(collectionRef, data);
  } 

  async getPolls(isAdmin: boolean) { 
    const collectionRef = collection(this.firestore, this.DB_POLLS);

    let queryString = null;
    if(!isAdmin){
      queryString = query(collectionRef, where('isActive', '==', true));
    }else {
      const currentUserId = this.authService.getCurrentUser().uid;
      queryString = query(collectionRef,where('ownerId', '==', currentUserId) ,where('isActive', '==', true));
    }

    this.currentPolls = [];
    return onSnapshot(queryString, (snapShot) =>{

      const data = snapShot.docChanges().map((change) => {

        if(change.type === 'added'){
          this.currentPolls.push({...change.doc.data(), pollId: change.doc.id} as CreatePoll);
          return {...change.doc.data(), pollId: change.doc.id} as CreatePoll;
        } else if (change.type === 'modified'){
          const index = this.currentPolls.findIndex((item) => item.pollId === change.doc.id);
          const updateData = change.doc.data() as CreatePoll;
          if (!updateData.isActive) {
            this.currentPolls.splice(index,1)
          }else {
            this.currentPolls[index] = {...change.doc.data(), pollId: change.doc.id} as CreatePoll
          }

          return {...change.doc.data(), pollId: change.doc.id} as CreatePoll
        } else if ( change.type === 'removed') {
          const index = this.currentPolls.findIndex((item) => item.pollId === change.doc.id);
          this.currentPolls.splice(index,1)
          return {...change.doc.data(), pollId: change.doc.id} as CreatePoll
        }

        return []
      })

      this.currentPolls = this.currentPolls.filter((item) => item.isActive);
      this.polls.next(this.currentPolls)
    })
  }


  async pollVote(poll: {voter: CreatePollVoters, pollId: string}){
    const docRef = doc(this.firestore, this.DB_POLLS, poll.pollId);

    const pollDoc = await getDoc(docRef);


    if(pollDoc.exists()){
      const data = pollDoc.data() as CreatePoll;

      const filterOptions = (data.voters ?? [] ).filter((item) => item.optionId === poll.voter.optionId);

      data.options[poll.voter.optionId].count = filterOptions.length + 1;

      await updateDoc(docRef, {
        options: data.options,
        voters: arrayUnion(poll.voter)
      })
    }else {
      throw Error('Can not update votes for poll that does not exist')
    }

  }

  async deletePollById (pollId: string) {
    const docRef = doc(this.firestore, this.DB_POLLS, pollId);

    await setDoc(docRef, {
      isActive: false
    },{merge: true})
  }
}