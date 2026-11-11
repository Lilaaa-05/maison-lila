const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../quiz.js'), 'utf8').split('const quizRoot =')[0];
const quiz = vm.runInNewContext(source + '\n({quizQuestions, drawQuizQuestions, gradeQuiz})');

test('30 unique questions each have four distinct options and a valid answer', () => {
    assert.equal(quiz.quizQuestions.length, 30);
    assert.equal(new Set(quiz.quizQuestions.map(q => q.question)).size, 30);
    for (const q of quiz.quizQuestions) {
        assert.equal(q.options.length, 4);
        assert.equal(new Set(q.options).size, 4);
        assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4);
        assert.ok(q.explanation.length > 0);
    }
});

test('draws 10 different questions, shuffles options without changing the correct text, and preserves the bank', () => {
    const original = JSON.stringify(quiz.quizQuestions);
    const seen = new Set();
    for (let draw = 0; draw < 50; draw++) {
        const questions = quiz.drawQuizQuestions();
        assert.equal(questions.length, 10);
        assert.equal(new Set(questions.map(q => q.id)).size, 10);
        seen.add(questions.map(q => q.id).join(','));
        questions.forEach(q => {
            const bankQuestion = quiz.quizQuestions[q.id];
            assert.equal(q.options[q.answer], bankQuestion.options[bankQuestion.answer]);
            assert.deepEqual([...q.options].sort(), [...bankQuestion.options].sort());
        });
    }
    assert.ok(seen.size > 1);
    assert.equal(JSON.stringify(quiz.quizQuestions), original);
});

test('each question is worth 1 point and exactly 8 is the passing boundary', () => {
    const questions = quiz.drawQuizQuestions();
    for (const expected of [0, 7, 8, 10]) {
        const answers = questions.map((q, i) => i < expected ? q.answer : (q.answer + 1) % 4);
        const result = quiz.gradeQuiz(questions, answers);
        assert.equal(result.score, expected);
        assert.equal(result.passed, expected >= 8);
    }
    assert.equal(quiz.gradeQuiz(questions, Array(10).fill(null)).score, 0);
});
