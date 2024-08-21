document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소들을 변수에 할당
    const input = document.querySelector('.todo');
    const todolist = document.querySelector('.todo-list');
    const addbutton = document.querySelector('.add-button');
    const keyCountDisplay = document.querySelector('.keyCount');
    const doneCountDisplay = document.querySelector('.doneCount');
    const noTaskMessage = todolist.querySelector('.notask'); // '아직 등록된 할 일이 없습니다' 메시지 요소
    const hrEl = document.querySelector('.hr1');
    // 모달 관련 요소
    const modal = document.querySelector('.modal');
    const closeModal = document.querySelector('.close');
    const editInput = document.querySelector('.edit-input');
    const saveButton = document.querySelector('.save-button');

    let keyCount = 0; // 할 일 항목 개수를 저장하는 변수
    let doneCount = 0; // 완료된 할 일 항목 개수를 저장하는 변수
    let currentEditItem = null; // 현재 수정 중인 항목을 저장할 변수

    // 할 일 개수와 완료된 개수를 업데이트하는 함수
    const updateCounts = () => {
        keyCountDisplay.innerHTML = `나의 할 일 목록 <span class = "count">${keyCount}</span>`;
        doneCountDisplay.innerHTML = `완료된 목록 <span class = "count">${doneCount}</span>`;
    };

    // '아직 등록된 할 일이 없습니다' 메시지를 숨기는 함수
    const hideNoTaskMessage = () => {
        if (keyCount > 0 && noTaskMessage) {
            noTaskMessage.style.display = 'none';
            hrEl.style.display = 'none';
        }
    };

    // 할 일 추가 함수
    const addtodo = () => {
        if (input.value.trim() === '') {
            alert('할 일을 입력해주세요');
            return;
        }

        const item = document.createElement('div');
        const checkbox = document.createElement('input');
        const text = document.createElement('span');
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');

        const key = keyCount;
        keyCount += 1;

        item.setAttribute('data-key', key);
        item.appendChild(checkbox);
        item.appendChild(text);
        item.appendChild(editButton);
        item.appendChild(deleteButton);
        todolist.appendChild(item);

        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                item.style.textDecoration = 'line-through';
                doneCount += 1;
              
            } else {
                item.style.textDecoration = '';
                doneCount -= 1;
            }
            updateCounts();
            saveTodosToLocalStorage();
        });

        text.textContent = input.value;

        // 수정 버튼 설정 및 이벤트 리스너 추가
        editButton.innerHTML =`<img src="./icon_imgs/edit.png" class="edit">`;
        editButton.addEventListener('click', () => {
            currentEditItem = text;
            editInput.value = text.textContent;
            modal.style.display = 'block';
        });

        // 제거 버튼 설정 및 이벤트 리스너 추가
        deleteButton.innerHTML = `<img src="./icon_imgs/trash.png" class="delete">`;
        deleteButton.addEventListener('click', () => {
            removetodo(key);
        });

        input.value = '';
        updateCounts();
        saveTodosToLocalStorage();
        hideNoTaskMessage();
    };

    // 할 일 제거 함수
    const removetodo = (key) => {
        const item = document.querySelector(`[data-key="${key}"]`);
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            doneCount -= 1;
        }
        todolist.removeChild(item);
        keyCount -= 1;
        updateCounts();
        saveTodosToLocalStorage();
        if (keyCount === 0 && noTaskMessage) {
            noTaskMessage.style.display = 'block';
             hrEl.style.display = 'block';
        }
    };

    // 추가 버튼 클릭 이벤트 리스너
    addbutton.addEventListener('click', addtodo);

    // Enter 키를 눌렀을 때 할 일 추가
    input.addEventListener('keyup', (event) => {
        const ENTER = 13;
        if (event.keyCode === ENTER) {
            addtodo();
        }
    });

    // 모달 닫기
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 모달 바깥 부분 클릭 시 모달 닫기
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    // 모달 저장 버튼 클릭 이벤트 리스너
    saveButton.addEventListener('click', () => {
        if (currentEditItem) {
            currentEditItem.textContent = editInput.value;
            modal.style.display = 'none';
            currentEditItem = null;
            saveTodosToLocalStorage();
        }
    });
   
    const saveTodosToLocalStorage = () => {
        const items = [];
        document.querySelectorAll('.todo-list > div').forEach(item => {
            const key = item.getAttribute('data-key');
            const text = item.querySelector('span').textContent;
            const checked = item.querySelector('input[type="checkbox"]').checked;

            items.push({ key, text, checked });
        });
        localStorage.setItem('todo-list', JSON.stringify(items));
    };

    // localStorage에서 할 일 목록을 불러오는 함수
    const loadTodosFromLocalStorage = () => {
        const storedTodos = localStorage.getItem('todo-list');
        if (storedTodos) {
            const items = JSON.parse(storedTodos);
            items.forEach(({ key, text, checked }) => {
                const item = document.createElement('div');
                const checkbox = document.createElement('input');
                const span = document.createElement('span');
                const deleteButton = document.createElement('button');
                const editButton = document.createElement('button');

                item.setAttribute('data-key', key);
                item.appendChild(checkbox);
                item.appendChild(span);
                item.appendChild(editButton);
                item.appendChild(deleteButton);
                todolist.appendChild(item);

                checkbox.type = 'checkbox';
                checkbox.checked = checked;
                checkbox.addEventListener('change', (event) => {
                    if (event.target.checked) {
                        item.style.textDecoration = 'line-through';
                        doneCount += 1;
                    } else {
                        item.style.textDecoration = '';
                        doneCount -= 1;
                    }
                    updateCounts();
                    saveTodosToLocalStorage();
                });

                span.textContent = text;
                if (checked) {
                    item.style.textDecoration = 'line-through';
                }

                // 수정 버튼 설정 및 이벤트 리스너 추가
                editButton.innerHTML = `<img src="./icon_imgs/edit.png" class="edit">`;
                editButton.addEventListener('click', () => {
                    currentEditItem = span;
                    editInput.value = span.textContent;
                    modal.style.display = 'block';
                });

                // 제거 버튼 설정 및 이벤트 리스너 추가
                deleteButton.innerHTML = `<img src="./icon_imgs/trash.png" class="delete">`;
                deleteButton.addEventListener('click', () => {
                    removetodo(key);
                });
            });
            keyCount = items.length;
            doneCount = items.filter(item => item.checked).length;
            updateCounts();
            hideNoTaskMessage();
        }
    };

    // 페이지 로드 시 localStorage에서 할 일 목록을 불러옴
    loadTodosFromLocalStorage();


});
