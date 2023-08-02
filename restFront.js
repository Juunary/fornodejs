async function getUser() {
  try {
    const res = await axios.get('/users');
    const users = res.data;
    const list = document.getElementById('list');
    list.innerHTML = '';

    Object.keys(users).map(function (key) {
      const userDiv = document.createElement('div');
      const span = document.createElement('span');
      span.textContent = `${users[key].name} (${users[key].age}세)`; // 이름과 나이를 함께 출력합니다.

      const edit = document.createElement('button');
      edit.textContent = '수정';
      edit.addEventListener('click', async () => {
        const name = prompt('바꿀 이름을 입력하세요');
        const age = prompt('나이를 입력하세요');
        if (!name || !age) {
          return alert('이름과 나이를 반드시 입력하셔야 합니다.');
        }
        try {
          await axios.put('/user/' + key, { name, age });
          getUser();
        } catch (err) {
          console.error(err);
        }
      });

      const remove = document.createElement('button');
      remove.textContent = '삭제';
      remove.addEventListener('click', async () => {
        try {
          await axios.delete('/user/' + key);
          getUser();
        } catch (err) {
          console.error(err);
        }
      });

      userDiv.appendChild(span);
      userDiv.appendChild(edit);
      userDiv.appendChild(remove);
      list.appendChild(userDiv);
    });
  } catch (err) {
    console.error(err);
  }
}//뭐?

window.onload = getUser;

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target.username.value;
  const age = e.target.age.value; // 폼에 나이 입력란을 추가합니다.
  if (!name || !age) {
    return alert('이름과 나이를 입력하세요');
  }
  try {
    await axios.post('/user', { name, age }); // 나이 정보도 함께 전송합니다.
    getUser();
  } catch (err) {
    console.error(err);
  }
  e.target.username.value = '';
  e.target.age.value = '';
});
