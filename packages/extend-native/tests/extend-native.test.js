
// eslint-disable-next-line import/no-extraneous-dependencies
const mount = require('../src')

// Mount the extensions before all tests
beforeAll(() => {
    mount()
})

describe('extend-native', () => {
    describe('Array extensions', () => {
        const sampleArray = [1, 2, 3, 4, 5]

        test('first should return the first element', () => {
            expect(sampleArray.first).toBe(1)
        })

        test('last should return the last element', () => {
            expect(sampleArray.last).toBe(5)
        })

        test('maxIndex should return the last index', () => {
            expect(sampleArray.maxIndex).toBe(4)
        })

        test('$first without filter should return the first element', () => {
            expect(sampleArray.$first()).toBe(1)
        })

        test('$first with filter should return the first element that matches the filter', () => {
            const result = sampleArray.$first((x) => { return x > 3 })
            expect(result).toBe(4)
        })

        test('$last without filter should return the last element', () => {
            expect(sampleArray.$last()).toBe(5)
        })

        test('$last with filter should return the last element that matches the filter', () => {
            const result = sampleArray.$last((x) => { return x < 4 })
            expect(result).toBe(3)
        })

        test('$before with filter should return the element before the one that matches the filter', () => {
            const result = sampleArray.$before((x) => { return x === 3 })
            expect(result).toBe(2)
        })

        test('$after with filter should return the element after the one that matches the filter', () => {
            const result = sampleArray.$after((x) => { return x === 3 })
            expect(result).toBe(4)
        })
    })

    describe('Date extensions', () => {
        const sampleDate = new Date('2024-03-07T16:31:01Z')

        test('timestamp should return the numeric value of the date', () => {
            expect(sampleDate.timestamp).toBe(sampleDate.getTime())
        })

        test('unixTimestamp should return the Unix timestamp of the date', () => {
            expect(sampleDate.unixTimestamp).toBe(Math.floor(sampleDate.getTime() / 1000))
        })

        test('$gt should return true if the date is greater than the argument', () => {
            const pastDate = new Date('2023-01-01')
            expect(sampleDate.$gt(pastDate)).toBe(true)
        })
    })
})
