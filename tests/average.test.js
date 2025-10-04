const { test, describe } = require('node:test');
const assert = require('node:assert')
const average = require('../utils/for_testing.js').average;


describe('everage', () => {
    test('of one value is the value itself', () => {
        assert.strictEqual(average([5]), 5)
    })

    test('of many is calculated right', () => {
        assert.strictEqual(average([3,5,2,2,3,8,11,20]), 6.75)
    })

    test('of empty array is zero', () => {
        assert.strictEqual(average([]), 0)
    })
})