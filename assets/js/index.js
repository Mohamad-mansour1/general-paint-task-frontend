let surveys = [];

function getSurveys() {
  $.ajax({
    url: "./assets/api/list.json",
    type: "GET",
    dataType: "JSON",
    success: function (response) {
      surveys = response;

      drawSurveys(surveys);
    },
  });
}

function drawSurveys(surveys) {
  let HTML = ``;

  if (surveys.length) {
    $.each(surveys, function (_, survey) {
      const { code } = survey;

      HTML += /*html*/ `
          <div class="col-12 col-lg-4" data-code="xx1">
              <div class="card">
                  <div class="card-body text-center">
                      <h4 class="card-title">${code}</h4>
                      <a href="survey-details.html?code=${code}" class="btn btn-link">View answers</a>
                  </div>
              </div>
          </div>
      `;
    });
  } else
    HTML += /*html*/ `<b class="text-danger">Your search does not match any survey code.</b>`;

  $("#surveys-container").html(HTML);
}

$(document).ready(function () {
  getSurveys();

  $("#search").keyup(function () {
    const searchValue = $(this).val();

    const filteredSurveys = surveys.filter((survey) =>
      survey.code.includes(searchValue)
    );

    drawSurveys(filteredSurveys);
  });
});
