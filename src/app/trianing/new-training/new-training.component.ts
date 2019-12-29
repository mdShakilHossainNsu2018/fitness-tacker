import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TrainingService} from '../training.service';
import {ExerciseModel} from '../exercise.model';
import {NgForm} from '@angular/forms';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable, Subscription} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import 'rxjs-compat/add/operator/map';
import OnDisconnect = firebase.database.OnDisconnect;
import {UiService} from '../../shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingStart = new EventEmitter<void>();

  exercises: ExerciseModel[];
  exerciseSubscription: Subscription;
  loadingSubscription: Subscription;

  isLoading = false;

  constructor(private trainingService: TrainingService, private uiShared: UiService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.uiShared.isloading.subscribe(value => {
      this.isLoading = value;
    });
    this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(exercises => (this.exercises = exercises));
    this.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
  }

}
