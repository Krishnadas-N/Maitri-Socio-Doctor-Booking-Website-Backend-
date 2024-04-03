
  export class DoctorSpecializtion{
    constructor(
        public name:string,
        public description?:string,
        public isBlocked = false,
        public _id?: string,
    ) {}
}