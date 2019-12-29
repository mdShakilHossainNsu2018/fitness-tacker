import {Injectable} from '@angular/core';
import {ExerciseModel} from './exercise.model';
import {Subject, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {UiService} from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private runningExercise: ExerciseModel;
  exerciseChange = new Subject<ExerciseModel>();
  exerciseChanged = new Subject<ExerciseModel[]>();
  finishedExerciseChanged = new Subject<ExerciseModel[]>();

  private fbSubscription: Subscription[] = [];

  private exercise: ExerciseModel[] = [];

  constructor(private db: AngularFirestore, private uiService: UiService) {
  }

  private availableExercises: ExerciseModel[] = [];

  fetchAvailableExercises() {
    this.uiService.isloading.next(true);
    this.fbSubscription.push(this.db.collection<ExerciseModel>('availableExercises')
      .snapshotChanges().pipe(map(docArray => docArray.map(doc => {
      return {
        id: doc.payload.doc.id,
        name: doc.payload.doc.data().name,
        duration: doc.payload.doc.data().duration,
        calories: doc.payload.doc.data().calories
      };
    }))).subscribe((exercise: ExerciseModel[]) => {
      this.availableExercises = exercise;
      this.exerciseChanged.next([...this.availableExercises]);
      this.uiService.isloading.next(false);
    }, error => {
        this.uiService.isloading.next(false);
        this.uiService.openSnackBar('Fetching Exercises failed, please try again!', 3000);
        this.exerciseChanged.next(null);
      }));
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChange.next({...this.runningExercise});
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  completeExercise() {
    this.addDataTODataBase({...this.runningExercise, date: new Date(), state: 'completed'});
    this.runningExercise = null;
    this.exerciseChange.next(null);
  }

  cancelledExercise(progress: number) {
    this.addDataTODataBase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.duration * (progress / 100),
      date: new Date(), state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChange.next(null);
  }

  fetchCompletedOrCancelledExercise() {
    this.fbSubscription.push(this.db.collection('finishedExercises').valueChanges().subscribe(
      (exercises: ExerciseModel[]) => {
        this.finishedExerciseChanged.next(exercises);
      }
    ));
  }
  private addDataTODataBase(exercise: ExerciseModel) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubscription.forEach(sub => sub.unsubscribe());
  }
}
