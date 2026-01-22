package com.sahil.pfba.controller;

import com.sahil.pfba.insights.InsightStatus;

public record UpdateInsightStatusRequest(
    InsightStatus status
) {

}
