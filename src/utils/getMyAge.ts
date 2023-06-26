import moment, { Moment } from "moment";

function calculateAge(birthDate: Moment): number {
  const currentDate = moment();
  const age = currentDate.diff(birthDate, "years");
  return age;
}

export function getMyAge(): number {
  const myBirthDate = moment("1994-07-17");
  const myAge = calculateAge(myBirthDate);
  return myAge;
}
