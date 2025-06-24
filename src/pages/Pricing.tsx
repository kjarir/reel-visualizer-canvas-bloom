
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$19",
      period: "/month",
      description: "Perfect for individual creators just getting started",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Up to 5 social accounts",
        "Basic analytics dashboard",
        "7-day data history",
        "Email support",
        "Standard reporting",
        "Basic competitor tracking"
      ],
      popular: false,
      buttonText: "Start Free Trial",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Advanced features for growing businesses and agencies",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "Up to 20 social accounts",
        "Advanced analytics & insights",
        "90-day data history",
        "Priority support",
        "Custom reporting",
        "Advanced competitor analysis",
        "Content optimization tools",
        "Team collaboration",
        "API access"
      ],
      popular: true,
      buttonText: "Start Free Trial",
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "Full-scale solution for large teams and enterprises",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Unlimited social accounts",
        "Enterprise analytics suite",
        "Unlimited data history",
        "24/7 dedicated support",
        "White-label reporting",
        "Advanced AI insights",
        "Custom integrations",
        "Advanced team management",
        "Full API access",
        "Custom training",
        "SLA guarantee"
      ],
      popular: false,
      buttonText: "Contact Sales",
      color: "from-gold-500 to-yellow-600"
    }
  ];

  const features = [
    "Real-time analytics across all platforms",
    "AI-powered content recommendations",
    "Competitor benchmarking",
    "Custom dashboard creation",
    "Advanced filtering and segmentation",
    "Automated reporting",
    "Team collaboration tools",
    "API integration support"
  ];

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial for all plans. No credit card required to start."
    },
    {
      question: "What happens to my data if I cancel?",
      answer: "Your data remains accessible for 30 days after cancellation. You can export your data at any time."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Yes, we provide custom solutions for large enterprises. Contact our sales team for more information."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Start with a free trial and scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-purple-500 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  asChild 
                  className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link to="/register">{plan.buttonText}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All plans include our core features designed to help you succeed with your social media strategy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who trust ReelAnalyzer with their social media success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="hover:scale-105 transition-transform">
              <Link to="/register">Start Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 transition-all">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
