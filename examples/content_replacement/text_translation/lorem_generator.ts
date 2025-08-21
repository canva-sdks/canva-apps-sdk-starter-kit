const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam metus ligula, laoreet porttitor quam cursus at. Vivamus non nulla congue, consectetur odio vitae, vehicula sapien. Vestibulum urna augue, commodo sit amet dolor eget, hendrerit porttitor felis. Fusce magna lorem, euismod id nisi eget, malesuada condimentum eros. Etiam lorem odio, bibendum sed vestibulum vel, maximus et urna. Mauris aliquet accumsan neque at tempor. Suspendisse euismod ultricies molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque elementum lacinia magna eu accumsan. Cras vitae massa ut felis maximus accumsan a id nisi. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla volutpat euismod lorem eu bibendum. Integer vitae efficitur quam, eget tristique sapien. Cras tellus risus, efficitur sit amet facilisis dignissim, condimentum vitae nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In neque tellus, ullamcorper id eros ullamcorper, lobortis ornare arcu. Aenean nec neque ut lectus ultricies gravida vitae dictum ligula. Nunc laoreet scelerisque varius. Pellentesque mollis tempor velit, id elementum risus venenatis vel. Curabitur egestas risus tortor, at rutrum mauris convallis sit amet. Aenean metus ante, tincidunt nec consectetur ut, rutrum id urna. Donec convallis consequat auctor. Cras rutrum finibus ligula et feugiat. Morbi dignissim turpis ipsum, eu maximus augue mollis a. Nullam sed lacus tortor. Mauris ut augue vel tortor tempus imperdiet at sed orci. Duis non turpis ut arcu laoreet aliquam. Vivamus arcu ex, feugiat et tempus et, vulputate vel augue. Quisque tempus malesuada cursus. Vivamus quis ultricies erat, mattis dictum neque. Etiam placerat vehicula diam eget tincidunt. Donec at sapien quis mi interdum cursus at vitae arcu. Nullam mattis ipsum ac consectetur tempor. Aliquam erat volutpat. Aliquam scelerisque ipsum id sem scelerisque ullamcorper. Maecenas ut sapien ac purus laoreet venenatis. Suspendisse ac ultrices tellus. Morbi eu leo feugiat, rhoncus ligula ut, aliquet dui. Quisque at nulla est. Vestibulum non quam in mi rutrum sodales gravida vel quam. Nunc felis tellus, fringilla et erat id, cursus consequat libero. Curabitur efficitur, neque vel cursus condimentum, tortor sapien facilisis neque, sed accumsan ex magna a ligula. Donec finibus tempus justo, et semper velit varius eget. Nunc eu porta nisi. In hac habitasse platea dictumst. Etiam tincidunt, sapien non dignissim consectetur, quam ante vestibulum nisi, at hendrerit ipsum orci ut leo. Nulla gravida elit eget ipsum malesuada tincidunt. Donec non tortor feugiat, cursus enim vel, egestas sem. Aliquam sit amet justo vitae ante tempor pellentesque. Curabitur quis lobortis leo. Aenean at semper quam, sed aliquet velit. Maecenas at vulputate tellus, nec hendrerit arcu. Vivamus efficitur est luctus imperdiet placerat.";

const loremWords = lorem.split(" ");

// This function converts words in a  string to lorem ipsum
export function convertWordsToLorem(text: string[]): string[] {
  let index = 0;
  return text.map((t) => {
    return t
      .split(" ")
      .map((w) => {
        if (w.length === 0) {
          return "";
        }
        const word = loremWords[index];
        index = (index + 1) % loremWords.length;
        return word;
      })
      .join(" ");
  });
}
