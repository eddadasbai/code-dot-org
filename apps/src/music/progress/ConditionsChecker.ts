// A small helper class that accumulates satisfied conditions, and then evaluates
// whether a set of conditions have all been satisfied.  Unknown conditions are
// skipped.  The accumulated satisfied conditions can be cleared at any time.

export interface Condition {
  name: string;
  value?: string | number;
}

export interface ConditionNames {
  [key: string]: string;
}

export default class ConditionsChecker {
  private currentSatisfiedConditions: Condition[];
  private conditionNames: ConditionNames;

  constructor(conditionNames: ConditionNames) {
    this.currentSatisfiedConditions = [];
    this.conditionNames = conditionNames;
  }

  // Reset the accumulated conditions.
  clear() {
    this.currentSatisfiedConditions = [];
  }

  // Accumulate a satisfied condition.
  addSatisfiedCondition(condition: Condition) {
    if (!this.hasCondition(condition)) {
      this.currentSatisfiedConditions.push(condition);
    }
  }

  // Determines whether we already know that a condition has been satisfied.
  private hasCondition(condition: Condition) {
    return this.currentSatisfiedConditions.some(
      currentSatisfiedCondition =>
        JSON.stringify(currentSatisfiedCondition) === JSON.stringify(condition)
    );
  }

  // Check whether the current set of satisfied conditions satisfy the given
  // required conditions.
  checkRequirementConditions(requiredConditions: Condition[]) {
    for (const requiredCondition of requiredConditions) {
      // If we don't yet support a condition, don't check against it for now.
      if (
        !Object.values(this.conditionNames).includes(requiredCondition.name)
      ) {
        continue;
      }

      // Not satisfying a required condition is a fail.
      if (!this.hasCondition(requiredCondition)) {
        return false;
      }
    }

    // All conditions are satisfied.
    return true;
  }
}
