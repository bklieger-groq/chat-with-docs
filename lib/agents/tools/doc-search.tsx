


// await fetch('/api/recommendations', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       query,
//       userInterests,
//     })
//   })
//     .then((res) => {
//       console.log(res)
//       if (res.ok) return res.json();
//     })
//     .then((recommendations) => {
//       console.log(recommendations.data.Get.Book);
//       setRecommendedBooks(recommendations.data.Get.Book);
//     });

//   setIsLoading(false);
//   setLoadedOnce(true);
// };