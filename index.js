const values = document.querySelector('#values');
const fftBtn = document.querySelector('#fftBtn');
const points = document.getElementsByName('points');
const gtbl = document.querySelector('#gvalues');
const htbl = document.querySelector('#hvalues');
const ftbl = document.querySelector('#fvalues');
const article = document.querySelector('#output');
const colHeaders = ['Formula', 'Value'];
let prob = null;
const POINT4 = '4point';
const POINT8 = '8point';
const ONEBYROOT2 = 0.70710678;
const NEGATIVEONEBYROOT2 = -0.70710678;
const w0 = 1;
const w1 = math.complex(ONEBYROOT2, NEGATIVEONEBYROOT2);
const w2 = math.complex(0, -1);
const w3 = math.complex(NEGATIVEONEBYROOT2, NEGATIVEONEBYROOT2);

fftBtn.addEventListener('click', (event) => {
  event.preventDefault();
  if (values.value.length > 0) {
    for (let point of points) {
      if (point.checked) {
        prob = point.value;
        break;
      }
    }
    console.log(prob);
    fft();
  }
});

const getData = (vals, param) => {
  const data = [];
  for (let i = 0; i < vals.length; i++) {
    data.push(vals[i][param]);
  }
  return data;
};
const fft = () => {
  article.style.display = 'block';
  const data = values.value.trim().split(' ');
  if (prob === POINT8 && data.length === 8) {
    for (let i = 0; i < data.length; i++) {
      data[i] = +data[i];
    }
    const gvals = calcGValue(data);
    createTbl(gvals, gtbl);
    const updatedGVals = getData(gvals, 'value');
    const hvals = calcHValue(updatedGVals);
    const updatedHVals = getData(hvals, 'value');
    createTbl(hvals, htbl);
    const fvals = calcFValue(updatedHVals);
    createTbl(fvals, ftbl);
  } else if (prob === POINT4 && data.length === 4) {
    for (let i = 0; i < data.length; i++) {
      data[i] = +data[i];
    }
    const gvals = calcG4Value(data);
    createTbl(gvals, gtbl);
    const updatedGVals = getData(gvals, 'value');
    const hvals = calcH4Value(updatedGVals);
    createTbl(hvals, htbl);
  }
};

const superscript = (data) => {
  return data.sup();
};
const subscript = (data) => {
  return data.sub();
};

const calcG4Value = (data) => {
  const ans = [];
  ans.push({
    formula: 'g(0) = x(0) + w0 * x(2)',
    value: add(data[0], data[2], w0),
  });
  ans.push({
    formula: 'g(1) = x(0) - w0 * x(2)',
    value: sub(data[0], data[2], w0),
  });
  ans.push({
    formula: 'g(2) = x(1) + w0 * x(3)',
    value: add(data[1], data[3], w0),
  });
  ans.push({
    formula: 'g(3) = x(1) - w0 * x(3)',
    value: sub(data[1], data[3], w0),
  });
  return ans;
};

const calcH4Value = (data) => {
  const ans = [];
  ans.push({
    formula: 'h(0) = g(0) + w0 * g(2)',
    value: add(data[0], data[2], w0),
  });
  ans.push({
    formula: 'h(1) = g(1) + w1 * g(3)',
    value: add(data[1], data[3], w1),
  });
  ans.push({
    formula: 'h(2) = g(0) - w0 * g(2)',
    value: sub(data[0], data[2], w0),
  });
  ans.push({
    formula: 'h(3) = g(1) - w1 * g(3)',
    value: sub(data[1], data[3], w1),
  });
  return ans;
};

const calcGValue = (data) => {
  const ans = [];
  ans.push({ formula: 'g(0) = x(0) + x(4)', value: add(data[0], data[4]) });
  ans.push({ formula: 'g(1) = x(0) - x(4)', value: sub(data[0], data[4]) });
  ans.push({ formula: 'g(2) = x(2) + x(6)', value: add(data[2], data[6]) });
  ans.push({ formula: 'g(3) = x(2) - x(6)', value: sub(data[2], data[6]) });
  ans.push({ formula: 'g(4) = x(1) + x(5)', value: add(data[1], data[5]) });
  ans.push({ formula: 'g(5) = x(1) - x(5)', value: sub(data[1], data[5]) });
  ans.push({ formula: 'g(6) = x(3) + x(7)', value: add(data[3], data[7]) });
  ans.push({ formula: 'g(7) = x(3) - x(7)', value: sub(data[3], data[7]) });
  return ans;
};

const calcHValue = (data) => {
  const ans = [];
  ans.push({
    formula: `h(0) = g(0) + w0 * g(2)`,
    value: add(data[0], data[2], w0),
  });
  ans.push({
    formula: `h(1) = g(1) + w2 * g(3)`,
    value: add(data[1], data[3], w2),
  });
  ans.push({
    formula: `h(2) = g(0) - w0 * g(2)`,
    value: sub(data[0], data[2], w0),
  });
  ans.push({
    formula: `h(3) = g(1) - w2 * g(3)`,
    value: sub(data[1], data[3], w2),
  });
  ans.push({
    formula: `h(4) = g(4) + w0 * g(6)`,
    value: add(data[4], data[6], w0),
  });
  ans.push({
    formula: `h(5) = g(5) + w2 * g(7)`,
    value: add(data[5], data[7], w2),
  });
  ans.push({
    formula: `h(6) = g(4) - w0 * g(6)`,
    value: sub(data[4], data[6], w0),
  });
  ans.push({
    formula: `h(7) = g(5) - w2 * g(7)`,
    value: sub(data[5], data[7], w2),
  });
  return ans;
};

const calcFValue = (data) => {
  const ans = [];
  ans.push({
    formula: `X(0) = h(0) + w0 * h(4)`,
    value: add(data[0], data[4], w0),
  });
  ans.push({
    formula: `X(1) = h(1) + w1 * h(5)`,
    value: add(data[1], data[5], w1),
  });
  ans.push({
    formula: `X(2) = h(2) + w2 * h(6)`,
    value: add(data[2], data[6], w2),
  });
  ans.push({
    formula: `X(3) = h(3) + w3 * h(7)`,
    value: add(data[3], data[7], w3),
  });
  ans.push({
    formula: `X(4) = h(0) + w0 * h(4)`,
    value: sub(data[0], data[4], w0),
  });
  ans.push({
    formula: `X(5) = h(1) + w1 * h(5)`,
    value: sub(data[1], data[5], w1),
  });
  ans.push({
    formula: `X(6) = h(2) + w2 * h(6)`,
    value: sub(data[2], data[6], w2),
  });
  ans.push({
    formula: `X(7) = h(3) + w3 * h(7)`,
    value: sub(data[3], data[7], w3),
  });

  return ans;
};

const createTbl = (data, tbl) => {
  tbl.innerHTML = '';
  const thead = document.createElement('thead');
  let row = document.createElement('tr');
  for (let i = 0; i < colHeaders.length; i++) {
    const th = document.createElement('th');
    const text = document.createTextNode(colHeaders[i]);
    th.appendChild(text);
    row.append(th);
  }
  thead.appendChild(row);
  tbl.appendChild(thead);
  const tbody = document.createElement('tbody');
  for (let rowData of data) {
    const row = document.createElement('tr');
    console.log(rowData);
    Object.keys(rowData).forEach((key) => {
      const val = rowData[key];
      const parser = new DOMParser();
      const doc = parser.parseFromString(val, 'text/html');
      const td = document.createElement('td');
      const txt = document.createTextNode(val);
      td.appendChild(txt);
      row.appendChild(td);
    });
    tbody.appendChild(row);
  }
  tbl.appendChild(tbody);
};
const add = (v1, v3, v2 = 1) => {
  return math.add(v1, math.multiply(v2, v3));
};
const sub = (v1, v3, v2 = 1) => {
  console.log(v1, v2, v3);
  return math.subtract(v1, math.multiply(v2, v3));
};
