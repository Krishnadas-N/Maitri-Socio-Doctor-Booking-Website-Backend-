// InterestedDoctor.ts

import { objectId } from "../../models/common-models";


export class InterestedDoctor {
    constructor(
      public userId: string,
      public doctorIds: { doctorId: objectId, dateAdded: Date }[],
      public _id?: string
    ) {}
  }
  