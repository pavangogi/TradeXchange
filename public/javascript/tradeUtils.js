var yes = document.getElementById('yes');
var test = document.getElementById('test');
test.style.display = 'none';

yes.addEventListener('click', function () {
    if (test.style.display == 'none') {
        test.style.display = 'block';
    } else {
        test.style.display = 'none';
    }
}
);