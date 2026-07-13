import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

const getRandomDateIn2024 = () => {
  const start = moment("2023-01-01T00:00:00Z");
  const end = moment("2023-12-31T23:59:59Z");
  const diffDays = end.diff(start, "days");
  const randomDay = random.int(0, diffDays);
  return start.clone().add(randomDay, "days").format();
};

const makeCommits = async (n) => {
  if (n <= 0) {
    console.log("Все коммиты созданы.");
    return;
  }

  const date = getRandomDateIn2024();
  const data = { date };

  jsonfile.writeFileSync(path, data);

  process.env.GIT_AUTHOR_DATE = date;
  process.env.GIT_COMMITTER_DATE = date;

  await git.add(path);
  await git.commit(`commit ${n}`, { "--date": date });

  console.log(`Создан коммит ${n}: ${date}`);
  await makeCommits(n - 1);
};

makeCommits(100).catch((error) => {
  console.error(error);
  process.exit(1);
});
