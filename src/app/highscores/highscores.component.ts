import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database';
import { Score } from '../score.model';
import { ScoreService } from '../score.service';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.css'],
  providers: [ScoreService]
})

export class HighscoresComponent implements OnInit {

  scores;
  newScores: Score[] = [];
  orderedScores: Score[] = [];
  displayScores: Score[] = [];

  constructor(private scoreService: ScoreService) { }

  ngOnInit() {
    this.scores = this.scoreService.getScores().subscribe(scores => {
      scores.forEach(score => {
        let newScore = new Score(score.name, score.points);
        this.newScores.push(newScore);
      });
      this.orderedScores = this.newScores.sort(function(obj1, obj2) {
        return obj1.points - obj2.points;
      });
      this.orderedScores = this.orderedScores.reverse();
      this.renderFinalTwentyScores();
    });
  }

  renderFinalTwentyScores() {
    for(let i = 0; i < 20; i++) {
      this.displayScores[i] = this.orderedScores[i];
    }
  }

}
