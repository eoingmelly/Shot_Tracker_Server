class GolferLookupAdapter {
  constructor({ golferService }) {
    if (!golferService)
      throw new Error("GolferLookupAdapter requires { golferService }");

    this._golferService = golferService;
  }

  async getGolferId({ sub }) {
    if (!sub)
      throw new Error("GolferLookupAdapter.getGolferidBySub requires { sub }");

    const { id } = await this._golferService.getGolferIdBySub({ sub });
    return id;
  }
}

module.exports = { GolferLookupAdapter };
