export class Policyholder {
    constructor(id, name, contactInfo) {
      this.id = id;
      this.name = name;
      this.contactInfo = contactInfo;
    }
  }
  
  export class Policy {
    constructor(id, policyholderId, policyAmount) {
      this.id = id;
      this.policyholderId = policyholderId;
      this.policyAmount = policyAmount;
    }
  }
  
  export class Claim {
    constructor(id, policyId, claimAmount, status = "Pending") {
      this.id = id;
      this.policyId = policyId;
      this.claimAmount = claimAmount;
      this.status = status;
    }
  }
  