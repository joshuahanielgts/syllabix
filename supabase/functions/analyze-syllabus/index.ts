import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const demoResults = {
  topics: [
    { name: "TCP Congestion Control", frequency: 9, priority: "High" },
    { name: "Routing Algorithms", frequency: 7, priority: "High" },
    { name: "OSI Model", frequency: 6, priority: "High" },
    { name: "Network Security", frequency: 5, priority: "Medium" },
    { name: "DNS & DHCP", frequency: 4, priority: "Medium" },
    { name: "Socket Programming", frequency: 3, priority: "Medium" },
    { name: "Error Detection & Correction", frequency: 2, priority: "Low" },
    { name: "Network Topologies", frequency: 2, priority: "Low" },
  ],
  coverage: 78,
  study_plan: [
    { day: 1, topic: "TCP Congestion Control" },
    { day: 2, topic: "Routing Algorithms" },
    { day: 3, topic: "OSI Model" },
    { day: 4, topic: "Network Security" },
    { day: 5, topic: "DNS & DHCP" },
  ],
  predicted_questions: [
    "Explain TCP congestion control mechanisms including slow start and congestion avoidance.",
    "Compare and contrast distance vector and link state routing algorithms.",
    "Describe the seven layers of the OSI model with examples.",
    "Discuss common network security threats and countermeasures.",
    "Explain the working of DNS resolution with a diagram.",
  ],
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { fileNames, userId } = await req.json();

    let analysisResult = demoResults;
    let usedAI = false;

    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (geminiKey) {
      try {
        // Download and extract text from PDFs
        const textParts: string[] = [];
        for (const fileName of fileNames) {
          const { data: fileData } = await supabase.storage
            .from("syllabus-uploads")
            .download(fileName);
          if (fileData) {
            const text = await fileData.text();
            textParts.push(text);
          }
        }

        const combinedText = textParts.join("\n\n---\n\n");

        const prompt = `Analyze the following syllabus and exam question papers.

Tasks:
1. Extract important academic topics.
2. Count topic frequency in exam papers.
3. Rank topics by importance (High, Medium, Low).
4. Estimate exam coverage if top topics are studied.
5. Generate a 5-day study plan.
6. Predict possible exam questions.

Return ONLY valid JSON in this exact format:
{
  "topics": [{"name": "Topic Name", "frequency": 6, "priority": "High"}],
  "coverage": 78,
  "study_plan": [{"day": 1, "topic": "Topic Name"}],
  "predicted_questions": ["Question text"]
}

Documents:
${combinedText.substring(0, 30000)}`;

        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          }
        );

        const geminiData = await geminiResponse.json();
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
          analysisResult = JSON.parse(responseText);
          usedAI = true;
        }
      } catch (aiError) {
        console.error("AI analysis failed, using demo results:", aiError);
      }
    }

    // Store results in database
    const { data: analysis, error: insertError } = await supabase
      .from("analyses")
      .insert({
        user_id: userId,
        file_names: fileNames,
        topics: analysisResult.topics,
        coverage_percentage: analysisResult.coverage,
        study_plan: analysisResult.study_plan,
        predicted_questions: analysisResult.predicted_questions,
      })
      .select("id")
      .single();

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ id: analysis.id, usedAI }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});