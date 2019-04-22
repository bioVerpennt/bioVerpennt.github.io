function toast(msg) {
  Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
  }).fire({
    type: 'success',
    title: msg,
  });
}


function handleError(msg) {
  Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
  }).fire({
    type: 'error',
    title: msg,
  });
}