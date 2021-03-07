import MatchersUtil = jasmine.MatchersUtil;
import CustomMatcherFactories = jasmine.CustomMatcherFactories;
import CustomEqualityTester = jasmine.CustomEqualityTester;
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;

export const CustomMatchers: CustomMatcherFactories = {
    toBeRespectively: function <T>(util: MatchersUtil, customEqualityTesters: readonly CustomEqualityTester[]): CustomMatcher {
        return {
            compare: function (actuals: T[], expecteds: ((arg: T) => boolean)[]): CustomMatcherResult {
                for (let i = 0; i < actuals.length; i++) {
                    if (expecteds.length <= i) break;

                    const expected = expecteds[i];
                    const actual = actuals[i];

                    if (!expected(actual)) {
                        return {
                            pass: false,
                            message: `item {${actual}} at index ${i} is not correct`,
                        };
                    }
                }

                return {
                    pass: true,
                    message: "passed",
                };
            },
        };
    },

    toOthers: function <T>(util: MatchersUtil, customEqualityTesters: readonly CustomEqualityTester[]): CustomMatcher {
        return {
            compare: function (actuals: T[], expecteds: ((arg: T, others: T[]) => boolean)[]): CustomMatcherResult {
                for (let i = 0; i < actuals.length; i++) {
                    if (expecteds.length <= i) break;

                    const expected = expecteds[i];

                    const actual = actuals[i];
                    const others = [...actuals];
                    others.splice(i);

                    if (!expected(actual, others)) {
                        return {
                            pass: false,
                            message: `item {${actual}} at index ${i} is not correct`,
                        };
                    }
                }

                return {
                    pass: true,
                    message: "passed",
                };
            },
        };
    },
};
