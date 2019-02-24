class Betsu {
  totalSpend: number;
  sharers: number;
  static minsharers: number = 2;

  constructor(totalSpend: number) {
    this.totalSpend = totalSpend;
    this.sharers = Betsu.minsharers;
    this.selfCheck();
  }
  updateMe(newSpend: number): void {
    if (newSpend) {
      this.totalSpend = newSpend;
      this.selfCheck();
    }
  }
  selfCheck = (): void => {
    console.log(
      "Betsu: Total Spend:" +
        this.totalSpend +
        ", Min Sharers:" +
        Betsu.minsharers
    );
  };
}
