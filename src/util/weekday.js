exports.convertToWeekday = (int) => {
  switch (int) {
    case 0:
    case "0":
      return "Monday";
    case 1:
    case "1":
      return "Tuesday";
    case 2:
    case "2":
      return "Wednesday";
    case 3:
    case "3":
      return "Thursday";
    case 4:
    case "4":
      return "Friday";
    case 5:
    case "5":
      return "Saturday";
    default:
      return "Monday";
  }
}