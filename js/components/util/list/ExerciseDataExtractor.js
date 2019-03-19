
var avatarSingle = require('../../../../img/type/single.png');
var avatarSuperset = require('../../../../img/type/superset.png');
var avatarDropset = require('../../../../img/type/dropset.png');
var avatarStriping = require('../../../../img/type/striping.png');
var avatarHourglass = require('../../../../img/type/hourglass.png');

var imgTired = require('../../../../img/moods/tired.png');
var imgOk = require('../../../../img/moods/ok.png');
var imgDead = require('../../../../img/moods/dead.png');

/**
 * This class formats the exercise in a suitable way for the GymExercisesList component.
 * It's extract() method is usable as a data extractor for the list
 */
class ExerciseDataExtractor {

  extract(item) {

    let ex = item.item;
    let s1, s2;
    let r1, r2, r3;
    let w1, w2, w3;
    let title1, title2;
    let subtitle1, subtitle2;
    let avatar = {type: 'image'};

    var q = (value) => {return value == null ? '?' : value}

    if (ex.type == 'single') {
      s1 = ex.sets; r1 = ex.reps; w1 = ex.weight;
      title1 = ex.name;
      subtitle1 = q(s1) + ' X ' + q(r1) + '  ' + q(w1) + ' Kg';
      avatar.value = avatarSingle;
    }
    else if (ex.type == 'superset') {
      s1 = ex.ex1.sets; r1 = ex.ex1.reps; w1 = ex.ex1.weight;
      s2 = ex.ex2.sets; r2 = ex.ex2.reps; w2 = ex.ex2.weight;
      title1 = ex.ex1.name;
      title2 = ex.ex2.name;
      subtitle1 = q(s1) + ' X ' + q(r1) + '  ' + q(w1) + ' Kg';
      subtitle2 = q(s2) + ' X ' + q(r2) + '  ' + q(w2) + ' Kg';
      avatar.value = avatarSuperset;
    }
    else if (ex.type == 'dropset') {
      s1 = ex.sets;
      r1 = ex.reps1; r2 = ex.reps2;
      w1 = ex.weight1; w2 = ex.weight2;
      title1 = ex.name;
      subtitle1 = q(s1) + ' X (' + q(r1) + ' + ' + q(r2) + ')' + '  ' + q(w1) + ' Kg' + '  ' + q(w2) + ' Kg';
      avatar.value = avatarDropset;
    }
    else if (ex.type == 'striping') {
      s1 = ex.sets;
      r1 = ex.reps1; r2 = ex.reps2; r3 = ex.reps3;
      w1 = ex.weight1; w2 = ex.weight2; w3 = ex.weight3;
      title1 = ex.name;
      subtitle1 = q(s1) + ' X (7 + 7 + 7)' + '  ' + q(w1) + ' Kg' + '  ' + q(w2) + ' Kg' + '  ' + q(w3) + ' Kg';
      avatar.value = avatarStriping;
    }
    else if (ex.type == 'hourglass') {
      w1 = ex.weight1; w2 = ex.weight2; w3 = ex.weight3;
      title1 = ex.name;
      subtitle1 = q(w1) + ' Kg' + '  ' + q(w2) + ' Kg' + '  ' + q(w3) + ' Kg';
      avatar.value = avatarHourglass;
    }

    return {
      title: title1,
      title2: title2,
      subtitle1: subtitle1,
      subtitle2: subtitle2,
      avatar: avatar,
    }

  }

}

export default new ExerciseDataExtractor();
