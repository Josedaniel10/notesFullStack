const { test } = require('node:test');
const assert = require('node:assert')
const reverse = require('../utils/for_testing.js').reverse;

test('reverse of "prueba testing"', () => {
    assert.strictEqual(
        reverse('prueba testing'),
        'gnitset abeurp'
    )
})

test('reverse of node', () => {
    assert.strictEqual(
        reverse('node'),
        'edon'
    )
})

test('reverse of level', () => {
    assert.strictEqual(
        reverse('level'),
        'level'
    )
})


